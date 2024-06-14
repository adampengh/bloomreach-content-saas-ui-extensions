import { Chip } from '@mui/material';

export const StatusIndicator = ({ message, status, size = 'small' }) => {
    const styling = { textTransform: 'capitalize', fontWeight: '400', marginLeft: '0.5rem', width: '100px' }

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
            color = 'default'
            variant = 'outlined'
            break
        default:
            color = 'default'
            variant = 'filled'
            break
    }

    return <Chip label={message} color={color} size={size} variant={variant} sx={styling} />
}
