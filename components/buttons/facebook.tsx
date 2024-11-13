import Link from 'next/link'

const FacebookIcon = () => {
  return (
    <div className="flex items-center justify-center w-fit h-fit text-white hover:text-yellow-light active:text-yellow-default">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_293_12295)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M3.08579 3.08579C3.46086 2.71071 3.96957 2.5 4.5 2.5H16.5C17.0304 2.5 17.5391 2.71071 17.9142 3.08579C18.2893 3.46086 18.5 3.96957 18.5 4.5V16.5C18.5 17.0304 18.2893 17.5391 17.9142 17.9142C17.5391 18.2893 17.0304 18.5 16.5 18.5H4.5C3.96957 18.5 3.46086 18.2893 3.08579 17.9142C2.71071 17.5391 2.5 17.0304 2.5 16.5V4.5C2.5 3.96957 2.71071 3.46086 3.08579 3.08579ZM16.5 0.5H4.5C3.43913 0.5 2.42172 0.921427 1.67157 1.67157C0.921427 2.42172 0.5 3.43913 0.5 4.5V16.5C0.5 17.5609 0.921427 18.5783 1.67157 19.3284C2.42172 20.0786 3.43913 20.5 4.5 20.5H16.5C17.5609 20.5 18.5783 20.0786 19.3284 19.3284C20.0786 18.5783 20.5 17.5609 20.5 16.5V4.5C20.5 3.43913 20.0786 2.42172 19.3284 1.67157C18.5783 0.921427 17.5609 0.5 16.5 0.5ZM9.19452 8.814V7.437C9.19452 7.43191 9.1945 7.42623 9.19448 7.42C9.19337 7.11761 9.18744 5.5 11.3175 5.5H12.8525V7.253H11.7245C11.5005 7.253 11.2745 7.484 11.2745 7.657V8.807H12.8505C12.7875 9.69 12.6565 10.497 12.6565 10.497H11.2665V15.5H9.19452V10.497H8.18652V8.814H9.19452Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_293_12295">
            <rect width="20" height="20" transform="translate(0.5 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

export const FacebookButton = () => {
  return (
    <Link
      href={'https://www.facebook.com/piercing.daryauo'}
      className="cursor-pointer flex items-center justify-center "
      target="_blank"
    >
      <FacebookIcon />
    </Link>
  )
}
