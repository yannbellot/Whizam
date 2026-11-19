import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField,
  Text,
} from 'react-aria-components'
import './styles/index.css'

export function PreciseValue({
  value,
  error,
  disabled,
  onChange,
}: {
  value: string
  error?: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <TextField
      className="loomata-ui ui:font-ui-sans ui:flex ui:flex-col ui:gap-ui-space ui:text-ui-ink ui:text-ui-body"
      value={value}
      onChange={onChange}
      isDisabled={disabled}
      isInvalid={!!error}
      validationBehavior="aria"
    >
      <Label>Valeur précise</Label>
      <Input
        aria-label="Valeur précise"
        className="ui:bg-ui-surface ui:text-ui-ink ui:p-ui-space ui:rounded-ui-radius ui:border-ui-border ui:focus-visible:outline-ui-accent"
      />
      {error && (
        <Text slot="description">
          Valeur invalide : {error} Le dernier aperçu valide est conservé.
        </Text>
      )}
    </TextField>
  )
}

export function AbandonDialog({
  disabled,
  onConfirm,
}: {
  disabled: boolean
  onConfirm: () => void
}) {
  return (
    <DialogTrigger>
      <Button isDisabled={disabled}>Annuler</Button>
      <ModalOverlay
        className="loomata-ui ui:font-ui-sans ui:fixed ui:inset-0 ui:flex ui:items-center ui:justify-center"
        isDismissable
      >
        <Modal className="ui:bg-ui-surface ui:text-ui-ink ui:p-ui-space ui:rounded-ui-radius ui:w-ui-dialog">
          <Dialog
            aria-describedby="loomata-abandon-description"
            className="ui:flex ui:flex-col ui:gap-ui-space"
          >
            {({ close }) => (
              <>
                <Heading slot="title">Abandonner le brouillon ?</Heading>
                <p id="loomata-abandon-description">
                  Tous les réglages non enregistrés seront abandonnés.
                </p>
                <div className="ui:flex ui:justify-end ui:gap-ui-space">
                  <Button autoFocus onPress={close}>
                    Conserver le brouillon
                  </Button>
                  <Button
                    onPress={() => {
                      onConfirm()
                      close()
                    }}
                  >
                    Abandonner les réglages
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}

export function EditToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label="Mode édition"
      aria-checked={checked}
      data-edit-toggle
      onClick={() => onChange(!checked)}
    >
      <span>Mode édition</span>
      <span data-edit-track aria-hidden="true">
        <span />
      </span>
    </button>
  )
}
