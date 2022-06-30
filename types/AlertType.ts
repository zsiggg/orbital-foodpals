export type AlertType = {
  type: AlertCategory
  message: string
  displayNow: boolean
}

export type AlertCategory = 'danger' | 'warning' | 'info' | 'success'
