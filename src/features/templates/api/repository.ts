import { simulate } from '@/shared/api/mockClient'
import { templates as seed } from '@/shared/mock/db'
import type { Template } from '@/shared/mock/types'

let list: Template[] = [...seed]
let addCounter = 0

export function extractVariables(text: string): string[] {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))]
}

export function fetchTemplates(search = ''): Promise<Template[]> {
  return simulate(() => {
    const term = search.trim().toLowerCase()
    return list.filter((template) => !term || template.name.toLowerCase().includes(term) || template.text.toLowerCase().includes(term))
  })
}

export interface TemplateInput {
  name: string
  text: string
}

export function createTemplate(input: TemplateInput): Promise<Template> {
  return simulate(() => {
    const template: Template = {
      id: `tpl_new_${++addCounter}`,
      name: input.name,
      text: input.text,
      variables: extractVariables(input.text),
      usedCount: 0,
      updatedAt: new Date().toISOString(),
    }
    list = [template, ...list]
    return template
  })
}

export function updateTemplate(id: string, input: TemplateInput): Promise<Template> {
  return simulate(() => {
    list = list.map((template) =>
      template.id === id
        ? { ...template, ...input, variables: extractVariables(input.text), updatedAt: new Date().toISOString() }
        : template,
    )
    return list.find((template) => template.id === id)!
  })
}

export function deleteTemplate(id: string): Promise<void> {
  return simulate(() => {
    list = list.filter((template) => template.id !== id)
  })
}
