import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
// import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import Copyright from '@/components/shared/Copyright'
import LogoAsText from '@/components/shared/LogoAsText'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const { t } = useTranslation()
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                {/* TODO: to be initiated later */}
                {/* <Logo mode="dark" /> */}
                <LogoAsText />
                <div>
                    <div className="mb-6 flex items-center gap-4">
                        <Avatar
                            className="border-2 border-white"
                            shape="circle"
                            src="/img/avatars/thumb-2.jpg"
                        />
                        <div className="text-white">
                            <div className="font-semibold text-base">
                                Mehmet Eyüpoğlu
                            </div>
                            <span className="opacity-80">Communiche</span>
                        </div>
                    </div>
                    <p className="text-lg text-white opacity-80">
                        {t('application.featuresExplanation')}
                    </p>
                </div>
                <Copyright />
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
