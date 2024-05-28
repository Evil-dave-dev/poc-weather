
import './button.css'

function Button(props: { name: string;  onRefresh: () => void}) {
    return (
        <button onClick={props.onRefresh} className='button'>{props.name}</button>
    )
}

export default Button