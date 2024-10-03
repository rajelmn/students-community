import {formatDistanceToNow,format, isToday, isYesterday} from 'date-fns';
export default function DynamicDate({date}) {
    const formatDate = (date) => {
        if(isToday(date)){
            return `today at ${format(date, 'h:mm a')}` 
        }else if(isYesterday(date)) {
            return `yesterday at ${format(date, 'h:mm a')}`
        }
        else {
             return `${formatDistanceToNow(date, { addSuffix: true })} at ${format(date, 'h:mm a')}`;
        }

    }
    return(
    <span className='text-xs text-[#bac0fa]'>{formatDate(date)}</span>
    )
}