import { api } from '@/shared/api/client'
import type { Template } from '@/shared/api/types'

export function extractVariables(text: string): string[] {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))]
}

export async function fetchTemplates(search = ''): Promise<Template[]> {
  const templates = await api<Template[]>('/templates')
  const term = search.trim().toLowerCase()
  if (!term) return templates
  return templates.filter(
    (template) => template.name.toLowerCase().includes(term) || template.text.toLowerCase().includes(term),
  )
}

export interface TemplateInput {
  name: string
  text: string
}

export function createTemplate(input: TemplateInput): Promise<Template> {
  return api<Template>('/templates', { method: 'POST', body: input })
}

export function updateTemplate(id: string, input: TemplateInput): Promise<Template> {
  return api<Template>(`/templates/${id}`, { method: 'PUT', body: input })
}

export function deleteTemplate(id: string): Promise<void> {
  return api(`/templates/${id}`, { method: 'DELETE' })
}
