const base = 'invitations'

const invite = () => base
const getInvitations = () => base
const resend = (invitationId: string) => `${base}/${invitationId}/resend`
const isValid = (invitationId: string) => `${base}/${invitationId}/valid`

const InvitationApis = {
  invite,
  getInvitations,
  resend,
  isValid,
}

export default InvitationApis
