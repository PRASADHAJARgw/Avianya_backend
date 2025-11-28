'use client'

import { useSupabase } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserLetterIcon from '@/components/users/UserLetterIcon'
import { Contact } from '@/types/contact'
import { useCallback, useEffect, useState } from 'react'
import { useAgents } from '../AgentContext'
import BlankUser from '../BlankUser'

export default function ChatHeader({ contact }: { contact: Contact | undefined }) {
    const agentState = useAgents()
    const { supabase } = useSupabase()
    const authContext = useAuth()
    const [roleAssigned, setRoleAssigned] = useState<string | null | undefined>(contact?.assigned_to || undefined)
    const [currentTime, setCurrentTime] = useState<string>('')

    // Real-time clock update - Indian Standard Time (IST)
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            // Use Indian locale with IST timezone
            setCurrentTime(now.toLocaleTimeString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit'
            }))
        }
        
        // Update immediately
        updateTime()
        
        // Update every second
        const interval = setInterval(updateTime, 1000)
        
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setRoleAssigned(contact?.assigned_to || undefined)
    }, [contact])
    
    const assignToAgent = useCallback(async (agentId: string | null) => {
        if (contact?.wa_id) {
            await supabase.from('contacts').update({ assigned_to: agentId }).eq('wa_id', contact.wa_id)
            setRoleAssigned(agentId)
        }
    }, [supabase, contact])

    // Check if user is admin (you can adjust this logic based on your auth setup)
    const isAdmin = authContext?.user?.email?.includes('admin') || true // Adjust based on your role logic

    return (
        <div className="bg-panel-header-background">
            <header className="px-4 py-2 flex flex-row gap-4 items-center">
                <div className="flex items-center gap-3">
                    <BlankUser className="w-10 h-10" />
                   
                </div>
                <div className='flex-grow'>
                    <div className='text-primary-strong font-semibold text-base'>
                        {contact?.name || contact?.profile_name || 'Unknown'}
                    </div>
                    <div className='text-xs text-gray-500'>
                        +{contact?.wa_id}
                    </div>
                </div>
                 <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                         {currentTime}
                    </div>
                {isAdmin && (
                    <div className='flex flex-row items-center gap-2'>
                        <div className='text-sm font-medium text-gray-700'>Assign to:</div>
                        <div>
                            <Select value={roleAssigned || undefined} onValueChange={(value) => { assignToAgent(value) }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agentState?.agents.map((ag) => {
                                        return (
                                            <SelectItem key={ag.id} value={ag.id}>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <UserLetterIcon user={ag} className='' />
                                                    <div className='flex-shrink-0'>
                                                        <div>{ag.firstName + ' ' + ag.lastName}</div>
                                                        <div>{ag.email}</div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                    {agentState?.agents.length === 0 && (
                                        <div className='flex flex-row gap-2 items-center'>
                                            <div className='flex-shrink-0 p-2'>
                                                <div className='text-sm text-gray-500'>No agents found</div>
                                            </div>
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {roleAssigned && (
                            <div>
                                <Button variant="outline" onClick={() => { assignToAgent(null) }} size="sm" className='rounded-full'>Unassign</Button>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </div>
    )
}
