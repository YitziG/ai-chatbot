import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          What's Up, Doc?
        </h1>
        <p className="leading-normal text-muted-foreground">
          Doctorpedia is a trustful, interactive, and engaging medical platform. We bring you pertinent medical
          information you can trust, from trusted sources and from physicians verified by certified medical boards. We
          believe that everyone deserves clear, concise, and accurate medical information.
        </p>
      </div>
    </div>
  )
}
