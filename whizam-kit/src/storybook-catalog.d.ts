declare module 'virtual:project-catalog' {
  const catalog: {
    stories: { file: string; title: string }[]
    rows: {
      id: string
      kind: string
      owner: string
      reference: string
      value: string
      categories: string[]
      property: string
      state: string
      consumer: string
      type: string
    }[]
    rules: string[]
  }
  export default catalog
}
