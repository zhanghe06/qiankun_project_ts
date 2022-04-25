import { FormattedMessage } from "react-intl";
import React from "react"

export function _(msg, values) {
  return <FormattedMessage id={msg} values={values} />
}
