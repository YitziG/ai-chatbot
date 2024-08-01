import {type ClassValue, clsx} from 'clsx'
import {customAlphabet} from 'nanoid'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    7
) // 7-character random string

export async function fetcher(endpoint: string, params?: Record<string, string>) {
    const url = new URL(`https://api.hospitalpedia.com${endpoint}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${process.env.DOCTORPEDIA_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        let error: any = new Error(`API request failed: ${response.statusText}`);
        error.status = response.status;

        if(response.status === 401) {
            error.message = 'Unauthorized';
        } else if(response.status === 403) {
            error.message = 'Forbidden';
        } else if(response.status === 404) {
            error.message = 'Not Found';
        } else {
            error.message = 'An unexpected error occurred';
        }

        let json;
        try {
            json = await response.json();
        } catch (error) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number
            };
            error.status = response.status;
            throw error;
        } else {
            throw new Error('An unexpected error occurred');
        }
    }

    try {
        return await response.json();
    } catch (error) {
        throw new Error('Invalid JSON response');
    }
}

export function formatDate(input: string | number | Date): string {
    const date = new Date(input)
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

export const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value)

export const runAsyncFnWithoutBlocking = (
    fn: (...args: any) => Promise<any>
) => {
    fn()
}

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

export enum ResultCode {
    InvalidCredentials = 'INVALID_CREDENTIALS',
    InvalidSubmission = 'INVALID_SUBMISSION',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    UnknownError = 'UNKNOWN_ERROR',
    UserCreated = 'USER_CREATED',
    UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
    switch (resultCode) {
        case ResultCode.InvalidCredentials:
            return 'Invalid credentials!'
        case ResultCode.InvalidSubmission:
            return 'Invalid submission, please try again!'
        case ResultCode.UserAlreadyExists:
            return 'User already exists, please log in!'
        case ResultCode.UserCreated:
            return 'User created, welcome!'
        case ResultCode.UnknownError:
            return 'Something went wrong, please try again!'
        case ResultCode.UserLoggedIn:
            return 'Logged in!'
    }
}
