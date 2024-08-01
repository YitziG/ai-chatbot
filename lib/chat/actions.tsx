import "server-only"

import {createAI, createStreamableValue, getAIState, getMutableAIState, streamUI} from 'ai/rsc'
import {openai} from '@ai-sdk/openai'

import {BotCard} from '@/components/bot/bot-card'
import { BotMessage } from '@/components/bot/bot-message'
import { DoctorpediaPatient } from '@/lib/types';
import {z} from 'zod'
import {AnalyticsSkeleton} from '@/components/analytics/analytics-skeleton'
import {UserSkeleton} from '@/components/analytics/user-skeleton'
import AnalyticsCard from '@/components/analytics/analytics-card'
import UserCard from '@/components/analytics/user-card'
import UserList from '@/components/analytics/user-list'
import {fetcher, nanoid, sleep} from '@/lib/utils'
import {saveChat} from '@/app/actions'
import {SpinnerMessage} from '@/components/messages/spinner-message'
import {UserMessage} from '@/components/messages/user-message'
import {Chat, Message} from '@/lib/types'
import {auth} from '@/auth'
import React from "react";
import { DoctorpediaUser } from '@/lib/types';
import PatientCard from "@/components/patients/patient-card";
import PatientList from "@/components/patients/patient-list";

async function submitUserMessage(content: string) {
    'use server'

    const aiState = getMutableAIState<typeof AI>()

    aiState.update({
        ...aiState.get(),
        messages: [
            ...aiState.get().messages,
            {
                id: nanoid(),
                role: 'user',
                content
            }
        ]
    })

    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    let textNode: undefined | React.ReactNode

    const result = await streamUI({
        model: openai('gpt-3.5-turbo'),
        initial: <SpinnerMessage/>,
        system: `\
    You are a Doctorpedia analytics assistant. You help the C-suite interact with user and platform analytics. 
    You can fetch user data, user details, user analytics, video details, video top tags, patient data, patient details, patient statistics, and platform analytics.
    
    Use the following tools to fetch and display data:
    - fetchUsers
    - fetchUserDetails
    - fetchUserAnalytics
    - fetchVideoDetails
    - fetchVideoTopTags
    - fetchPatientData
    - fetchPatientDetails
    - fetchPatientStatistics
    - fetchPlatformAnalytics
    
    Messages inside [] indicate a UI element or a user event. For example:
    - "[Fetch user data]" means a button to fetch user data is displayed.
    - "[User requests user details]" means the user has requested detailed data for a specific user.
    
    If the user requests data, call the appropriate tool to fetch and display the data.
    Besides fetching data, you can also chat with users and provide insights based on the data.`,
        messages: [
            ...aiState.get().messages.map((message: any) => ({
                role: message.role,
                content: message.content,
                name: message.name
            }))
        ],
        text: ({content, done, delta}) => {
            if (!textStream) {
                textStream = createStreamableValue('')
                textNode = <BotMessage content={textStream.value}/>
            }

            if (done) {
                textStream.done()
                aiState.done({
                    ...aiState.get(),
                    messages: [
                        ...aiState.get().messages,
                        {
                            id: nanoid(),
                            role: 'assistant',
                            content
                        }
                    ]
                })
            } else {
                textStream.update(delta)
            }

            return textNode
        },
        tools: {
            fetchUsers: {
                description: 'Fetch a list of users from Doctorpedia API.',
                parameters: z.object({
                    params: z.record(z.string()).optional().describe('Optional query parameters for the API call.')
                }),
                generate: async function* ({params}) {
                    yield (
                        <BotCard>
                            <UserSkeleton/>
                        </BotCard>
                    )

                    await sleep(1000)

                    const toolCallId = nanoid()
                    const result = await fetcher("/v1/admin/users", params)
                    const users = result.data
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'fetchUsers',
                                        toolCallId,
                                        args: {params}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'fetchUsers',
                                        toolCallId,
                                        result: users
                                    }
                                ]
                            }
                        ]
                    })

                    return (
                        <BotCard>
                            <UserList users={users}/>
                        </BotCard>
                    )
                }
            },
            fetchUserDetails: {
                description: 'Fetch details of a specific user from Doctorpedia API.',
                parameters: z.object({
                    userId: z.string().describe('The ID of the user to fetch details for.')
                }),
                generate: async function* ({userId}) {
                    yield (
                        <BotCard>
                            <UserSkeleton/>
                        </BotCard>
                    )

                    await sleep(1000)

                    const toolCallId = nanoid()
                    const result = await fetcher(`/v1/admin/users/${userId}`)
                    const user = result.data as DoctorpediaUser;

                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'fetchUserDetails',
                                        toolCallId,
                                        args: {userId}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'fetchUserDetails',
                                        toolCallId,
                                        result
                                    }
                                ]
                            }
                        ]
                    })

                    return (
                        <BotCard>
                            <UserCard data={user}/>
                        </BotCard>
                    )
                }
            },
            fetchPatients: {
                description: 'Fetch a list of patients from Doctorpedia API.',
                parameters: z.object({
                    params: z.record(z.string()).optional().describe('Optional query parameters for the API call.')
                }),
                generate: async function* ({params}) {
                    yield (
                        <BotCard>
                            <UserSkeleton />
                        </BotCard>
                    )
        
                    await sleep(1000)
        
                    const toolCallId = nanoid()
                    const result = await fetcher("/v1/patients", params)
                    const patients = result.data
        
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'fetchPatients',
                                        toolCallId,
                                        args: {params}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'fetchPatients',
                                        toolCallId,
                                        result: patients
                                    }
                                ]
                            }
                        ]
                    })
        
                    return (
                        <BotCard>
                            <PatientList patients={patients} />
                        </BotCard>
                    )
                }
            },
            fetchPatientDetails: {
                description: 'Fetch details of a specific patient from Doctorpedia API.',
                parameters: z.object({
                    patientId: z.string().describe('The ID of the patient to fetch details for.')
                }),
                generate: async function* ({patientId}) {
                    yield (
                        <BotCard>
                            <UserSkeleton/>
                        </BotCard>
                    )
            
                    await sleep(1000)
            
                    const toolCallId = nanoid()
                    const result = await fetcher(`/v1/patients/${patientId}`)
                    const patient = result.data as DoctorpediaPatient;
            
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'fetchPatientDetails',
                                        toolCallId,
                                        args: {patientId}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'fetchPatientDetails',
                                        toolCallId,
                                        result
                                    }
                                ]
                            }
                        ]
                    })
            
                    return (
                        <BotCard>
                            <PatientCard data={patient}/>
                        </BotCard>
                    )
                }
            },
            fetchPlatformAnalytics: {
                description: 'Fetch overall platform analytics from Doctorpedia API.',
                parameters: z.object({
                    params: z.record(z.string()).optional().describe('Optional query parameters for the API call.')
                }),
                generate: async function* ({params}) {
                    yield (
                        <BotCard>
                            <AnalyticsSkeleton/>
                        </BotCard>
                    )

                    await sleep(1000)

                    const toolCallId = nanoid()
                    const result = await fetcher("/v1/admin/analytics", params)

                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'fetchPlatformAnalytics',
                                        toolCallId,
                                        args: {params}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'fetchPlatformAnalytics',
                                        toolCallId,
                                        result
                                    }
                                ]
                            }
                        ]
                    })

                    return (
                        <BotCard>
                            <AnalyticsCard title="Platform Analytics" data={result}/>
                        </BotCard>
                    )
                }
            },
        }
    })

    return {
        id: nanoid(),
        display: result.value
    }
}

export type AIState = {
    chatId: string
    messages: Message[]
}

export type UIState = {
    id: string
    display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage
    },
    initialUIState: [],
    initialAIState: {chatId: nanoid(), messages: []},
    onGetUIState: async () => {
        'use server'

        const session = await auth()

        if (session && session.user) {
            const aiState = getAIState() as Chat

            if (aiState) {
                const uiState = getUIStateFromAIState(aiState)
                return uiState
            }
        } else {
            return
        }
    },
    onSetAIState: async ({state}) => {
        'use server'

        const session = await auth()

        if (session && session.user) {
            const {chatId, messages} = state

            const createdAt = new Date()
            const userId = session.user.id as string
            const path = `/chat/${chatId}`

            const firstMessageContent = messages[0].content as string
            const title = firstMessageContent.substring(0, 100)

            const chat: Chat = {
                id: chatId,
                title,
                userId,
                createdAt,
                messages,
                path
            }

            await saveChat(chat)
        } else {
            return
        }
    }
})

export const getUIStateFromAIState = (aiState: Chat) => {
    try {
        return aiState.messages
            .filter(message => message.role !== 'system')
            .map((message, index) => ({
                id: `${aiState.chatId}-${index}`,
                display:
                    message.role === 'tool' ? (
                        message.content.map(tool => {
                            switch (tool.toolName) {
                                case 'fetchUsers':
                                    return (
                                        <BotCard>
                                            <UserList users={tool.result as DoctorpediaUser[]}/>
                                        </BotCard>
                                    )
                                case 'fetchPlatformAnalytics':
                                    return (
                                        <BotCard>
                                            <AnalyticsCard
                                                title='Platform Analytics'
                                                data={tool.result}/>
                                        </BotCard>
                                    )
                                case 'fetchPatients':
                                    return (
                                        <BotCard>
                                            <PatientList patients={tool.result as DoctorpediaPatient[]} />
                                        </BotCard>
                                    )
                                case 'fetchUserDetails':
                                    return (
                                        <BotCard>
                                            <UserCard data={tool.result as DoctorpediaUser}/>
                                        </BotCard>
                                    )
                                case 'fetchPatientDetails':
                                    return (
                                        <BotCard>
                                            <PatientCard data={tool.result as DoctorpediaPatient}/>
                                        </BotCard>
                                    )
                                // ... (handle other tool results similarly)
                                default:
                                    return null
                            }
                        })
                    ) : message.role === 'user' ? (
                        <UserMessage>{message.content as string}</UserMessage>
                    ) : message.role === 'assistant' &&
                    typeof message.content === 'string' ? (
                        <BotMessage content={message.content}/>
                    ) : null
            }))
    } catch (error) {
        console.error('Error getting UI state from AI state:', error)
        return []
    }
}
