export interface OpenCodeTextPart {
  type: 'text'
  text: string
}

export interface OpenCodeMessage {
  info?: {
    role?: string
  }
  parts?: OpenCodeTextPart[]
}

export interface OpenCodeOutput {
  messages?: OpenCodeMessage[]
}

export interface OpenCodeConfig {
  skills?: {
    paths?: string[]
  }
  nexxoria?: Record<string, unknown>
}
