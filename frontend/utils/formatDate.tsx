import { parseISO, format, formatDistanceToNow } from 'date-fns'

export const formatDate = (dateString : string) => {
    const date = new Date(dateString);

    let formattedDate = formatDistanceToNow(date, {addSuffix: true})

    formattedDate = formattedDate.replace('about', '')
    
    return formattedDate
};