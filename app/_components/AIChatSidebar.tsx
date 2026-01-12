"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet, SheetTrigger, SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useAction } from 'convex/react';
import { Bot, Loader2, Send, User } from 'lucide-react';
import React, { useState } from 'react'


type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};
function AIChatSidebar() {

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your MedCare assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Convex Action
    const sendMessage = useAction(api.actions.chat);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user" as const, content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const history = newMessages.map(m => ({ role: m.role, content: m.content }));

            const response = await sendMessage({
                message: input,
                conversationHistory: history
            });

            if (response) {
                setMessages(prev => [...prev, { role: "assistant", content: response }]);
            }



        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }


    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>

                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 z-50 animate-in fade-in zoom-in duration-300"
                    size="icon"
                >
                    <Bot className="w-8 h-8 text-white" />
                </Button>
            </SheetTrigger>


            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col border-l border-border bg-background ">
                <SheetHeader>
                    <SheetTitle>

                        <Bot className="w-6 h-6" /> MedCare AI Assistant
                    </SheetTitle>


                </SheetHeader>
                <ScrollArea className="flex-1 pr-4 mt-4">
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 text-sm max-w-[85%]",
                                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    m.role === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                                )}>
                                    {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl",
                                    m.role === "user"
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-muted text-foreground rounded-bl-none"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 text-sm mr-auto">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-muted text-foreground p-3 rounded-2xl rounded-bl-none flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="pt-4 mt-auto">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="bg-muted border-border focus-visible:ring-primary"
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {["Check my appointments", "Opening hours?"].map(q => (
                            <Button
                                key={q}
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap text-xs h-7 text-muted-foreground"
                                onClick={() => {
                                    setInput(q);
                                    // Optional: auto send?
                                }}
                            >
                                {q}
                            </Button>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AIChatSidebar