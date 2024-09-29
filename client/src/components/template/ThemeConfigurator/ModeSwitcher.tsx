import useDarkMode from '@/utils/hooks/useDarkmode'
import { BsMoonStars, BsSun } from 'react-icons/bs'

const ModeSwitcher = () => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = () => {
        setIsDark(isDark ? 'light' : 'dark')
    }

    return (
        <div>
            {!isDark ? (
                <div
                    className="text-2xl header-action-item header-action-item-hoverable"
                    onClick={onSwitchChange}
                >
                    <BsMoonStars />
                </div>
            ) : (
                <div
                    className="text-2xl header-action-item header-action-item-hoverable"
                    onClick={onSwitchChange}
                >
                    <BsSun />
                </div>
            )}
        </div>
    )
}

export default ModeSwitcher
