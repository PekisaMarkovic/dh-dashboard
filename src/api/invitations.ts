const base = 'invitations'

const invite = () => base
const getInvitations = () => base
const isValid = (invitationId: string) => `${base}/${invitationId}/valid`

const InvitationApis = {
  invite,
  getInvitations,
  isValid,
}

export default InvitationApis
