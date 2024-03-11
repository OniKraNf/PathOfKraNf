'use client'

import React from 'react'
import { Input2 } from './ui/input2'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const Trade = () => {
  return (
    <div>
        <div className='w-full mx-auto p-4 md:p-8 text-white bg-[#8a373700] border border-black/[0.2] dark:border-white/[0.2] rounded-md relative'>
            <Tabs defaultValue='search-items' className='w-[400px]'>
                <TabsList className='bg-[#27272a] text-white flex'>
                    <TabsTrigger className='data-[state=active]:bg-black data-[state=active]:text-white w-full' value='search-items'>Search items</TabsTrigger>
                    <TabsTrigger className='data-[state=active]:bg-black data-[state=active]:text-white w-full' value='bulk-item'>Bulk item</TabsTrigger>
                </TabsList>
                <TabsContent value='search-items'>
                    <Input2 placeholder='Search' className='bg-black'/>
                    <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>Type filters</AccordionTrigger>
                            <AccordionContent>Item category</AccordionContent>
                            <AccordionContent>Item rarity</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>
                <TabsContent value='bulk-item'>
                    <Input2 placeholder='Search' className='bg-black'/>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}

export default Trade