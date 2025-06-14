import { Button } from '@/components/ui/button'
import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'

//unstyled clerk component - SignInButton, SignUpButton
//SignedOut-control component-Any child nodes wrapped by this will be rendered only if there's no User signed in 
const AuthButton = () => {
  return (
    <SignedOut>
      <div className="flex gap-x-3  justify-center items-center">
        <SignInButton> 
          <Button
            variant="default"
            className="px-10 rounded-full border-2 border-amber-50 "
          >
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button variant="default" className="px-10 rounded-full ">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  )
}

export default AuthButton
