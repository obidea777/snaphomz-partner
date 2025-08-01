"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare } from "lucide-react"
import { useAtom } from "jotai"
import { agentReadWriteAtom } from "store/atoms/agent-atom"
import { useRouter } from "next/navigation"
import { decryptMessage, encryptMessage } from "lib/math-utilities"

export default function NewNotification(props:any) {
  const router = useRouter();
  const { state,setState ,socket} = props
  const [isVisible, setIsVisible] = useState(true)
  const [agentData] = useAtom(agentReadWriteAtom)
  const isLoggedIn = agentData.is_authenticated
  useEffect(() => {
    setIsVisible(state.notification.isVisible);
    const showTimer = setTimeout(() => {
      setIsVisible(false)
      setState((prev:any)=>({
        ...prev,
        notification: {
          user: null,
          property: null,
          message: "",
          channelId: null,
          isVisible: false
        },
      }))
    }, 10000)

    return () => clearTimeout(showTimer)
  }, [state])  

  return (
    <AnimatePresence>
      {isVisible && isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 0 }}
          className="fixed cursor-pointer bottom-4 right-4 bg-orange-400 text-white border border-orange-500 rounded-lg shadow-lg p-4 w-80 z-50"
        >
          <div className="flex items-start justify-between"
          onClick={(e)=>{
            e.preventDefault();            
            router.push(`/dashboard/messages/${state?.notification?.channelId}`)
          }}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-white" />
              <div>
                <p className="text-sm font-semibold">{state.notification.user|| "Vijay kumar"} ({state.notification.property || "New property"})</p>
                <p className="text-xs text-orange-100">
                  {decryptMessage(state.notification.message) || "I am interested in your property"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
