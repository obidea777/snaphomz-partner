// import * as React from 'react'

// interface IErrorBoundaryProps {
//   children: React.ReactNode
// }

// interface IErrorBoundaryState {
//   hasError: boolean
//   error: Error | null
//   errorInfo: React.ErrorInfo | null
// }

// class ErrorBoundary extends React.Component<
//   IErrorBoundaryProps,
//   IErrorBoundaryState
// > {
//   constructor(props: IErrorBoundaryProps) {
//     super(props)
//     this.state = { hasError: false, error: null, errorInfo: null }
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error }
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
//     this.setState({ errorInfo, error })
//   }

//   render() {
//     const { hasError } = this.state

//     if (hasError) {
//       return (
//         <section
//           className="relative mx-auto  flex min-h-screen w-full items-center justify-center px-5 md:max-w-sm lg:max-w-3xl lg:py-4"
//           component="div">
//           <section
//             className="absolute left-1/2 top-1/2 flex h-[inherit] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center md:h-full"
//             component="div">
//             <section component="div" className="lg:right-12- absolute right-6">
//               <Ellipse />
//             </section>
//             <BackgroundEllipse />
//           </section>
//           <section className="absolute z-30" component="div">
//             <ErrorCardBox
//               title="An error occured😞"
//               description="Not to worry, we have saved this error and working out with the team to resolve it"
//               heading={
//                 <Box
//                   className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-secondary-100"
//                   component="div">
//                   <Box
//                     className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-secondary-200"
//                     component="div">
//                     <SearchIcon strokeColor="#283655" />
//                   </Box>
//                 </Box>
//               }
//               footerText="Try reloading the page or"
//             />
//           </Box>
//         </Box>
//       )
//     }

//     return this.props.children
//   }
// }

// export default ErrorBoundary
