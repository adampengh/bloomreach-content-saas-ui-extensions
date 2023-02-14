import {
    Chip,
} from '@mui/material';

const StatusIndicator = ({ message, status }) => {
    const styling = { textTransform: 'capitalize', fontWeight: 'bold', marginLeft: '0.5rem' }

    let color, variant
    switch (status) {
        case 'IN_PROGRESS':
            color = 'primary'; break
        case 'IN_REVIEW':
            color = 'warning'; break
        case 'APPROVED':
            color = 'success'; break
        case 'REBASE_ERROR':
            color = 'error'; break
        case 'MERGE_ERROR':
            color = 'error'; break
        case 'MERGED':
            color = 'primary'
            variant = 'outlined'
            break
        default:
            color = 'success'
            variant = 'filled'
            break
    }

    return <Chip label={message} color={color} size="small" variant={variant} sx={styling} />
}

export default StatusIndicator
