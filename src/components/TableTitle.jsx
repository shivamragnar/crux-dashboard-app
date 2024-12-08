import { Typography } from "@mui/material"

const TableTitle = ({ urls }) => {
  const headerText =
    urls.length === 1
      ? `CRUX Metrics for: ${urls[0]}`
      : `CRUX Metrics Summary for: ${urls[0]} +${urls.length - 1}`

  return <Typography variant="h6">{headerText}</Typography>
}

export default TableTitle
