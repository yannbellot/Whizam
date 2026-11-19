import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../../../src/design-system/components/Notice'
import { ProjectSummary } from './ProjectSummary'

const meta = {
  id: 'projects-summary',
  title: '02 — Components/UI Components/ProjectSummary',
  component: ProjectSummary,
  tags: ['autodocs'],
  parameters: { appearance: { component: true } },
  args: {
    project: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Projet fictif',
      description: 'Exemple autonome sans base.',
      createdAt: '2026-10-20T10:00:00.000Z',
      updatedAt: '2026-10-21T11:00:00.000Z',
    },
  },
  decorators: [
    (Story) => (
      <Panel>
        <Story />
      </Panel>
    ),
  ],
} satisfies Meta<typeof ProjectSummary>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const EmptyDescription: Story = {
  args: { project: { ...meta.args.project, description: '' } },
}
export const LiteralContent: Story = {
  args: { project: { ...meta.args.project, description: '<script>texte non exécuté</script>' } },
}
