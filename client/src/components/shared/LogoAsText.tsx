import { useNavigate } from 'react-router-dom'

export default function LogoAsText() {
    const navigate = useNavigate()
    const handleNavigateToHome = () => {
        navigate('/')
    }
    return (
        <span
            className="dark:text-sky-50 text-black font-thin text-3xl hidden lg:block cursor-pointer"
            onClick={handleNavigateToHome}
        >
            COMMU<span className="font-extrabold">NICHE</span>
        </span>
    )
}
