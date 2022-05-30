import Image from 'next/image'

export default () => {
    return (
        <>
        <div className="flex justify-center">
        <Image
            src="/tempLogo.svg"
            width={52.5}
            height={48}
            />
        </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Foodpals</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Order in or deliver at your convenience, right now.</p>
        </>
    )
}