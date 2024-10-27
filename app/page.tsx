'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { Textarea } from '@/components/ui/Textarea'
import Image from 'next/image'
import { Switch } from "@/components/ui/Switch"
import toast from 'react-hot-toast'

export default function PollinationsCheatsheet() {
  const [imageResult, setImageResult] = useState<string | null>(null)
  const [textResult, setTextResult] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageWidth, setImageWidth] = useState<number>(1024)
  const [imageHeight, setImageHeight] = useState<number>(1024)
  const [imageSeed, setImageSeed] = useState<number>(Math.floor(Math.random() * 1000000))
  const [imageStatus, setImageStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [useRandomSeed, setUseRandomSeed] = useState<boolean>(false)

  useEffect(() => {
    if (useRandomSeed) {
      setImageSeed(Math.floor(Math.random() * 1000000))
    }
  }, [useRandomSeed])

  const handleImageGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImageResult(null)
    setLoading(true)
    setImageStatus('pending')
    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('imagePrompt') as string
    const model = formData.get('imageModel') as string
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${imageWidth}&height=${imageHeight}&seed=${imageSeed}&model=${model}&nologo=true`
    
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Failed to generate image')
      }
      setImageResult(imageUrl)
      setImageStatus('success')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error("Error generating image. Please try again.")
      setImageStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleTextGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('textPrompt') as string
    const model = formData.get('textModel') as string
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${model}`)
      const result = await response.text()
      setTextResult(result)
    } catch (error) {
    toast.error("Error generating text. Please try again.")
      console.error('Error generating text:', error)
      setTextResult('Error generating text. Please try again.')
    }
    setLoading(false)
  }

  const regenerateWithRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000)
    setImageSeed(newSeed)
    handleImageGeneration({ preventDefault: () => {}, currentTarget: document.querySelector('form') } as React.FormEvent<HTMLFormElement>)
  }

  const imageModels = [
    { value: 'flux', label: 'Flux', censored: false, paid: false },
    { value: 'flux-realism', label: 'Flux Realism', censored: true, paid: false },
    { value: 'flux-cablyai', label: 'Flux CablyAI', censored: true, paid: true },
    { value: 'flux-anime', label: 'Flux Anime', censored: true, paid: false },
    { value: 'flux-3d', label: 'Flux 3D', censored: true, paid: false },
    { value: 'any-dark', label: 'Any Dark', censored: true, paid: false },
    { value: 'flux-pro', label: 'Flux Pro', censored: true, paid: true },
    { value: 'turbo', label: 'Turbo', censored: false, paid: false },
  ]

  const textModels = [
    { value: 'openai', label: 'OpenAI GPT-4', censored: true, paid: false },
    { value: 'mistral', label: 'Mistral Nemo', censored: false, paid: false },
    { value: 'mistral-large', label: 'Mistral Large (v2)', censored: false, paid: false },
    { value: 'llama', label: 'Llama 3.1', censored: true, paid: false },
    { value: 'command-r', label: 'Command-R', censored: false, paid: false },
    { value: 'unity', label: 'Unity with Mistral Large', censored: false, paid: false },
    { value: 'midijourney', label: 'Midijourney', censored: true, paid: false },
    { value: 'rtist', label: 'Rtist', censored: true, paid: false },
    { value: 'searchgpt', label: 'SearchGPT', censored: true, paid: false },
    { value: 'evil', label: 'Evil Mode', censored: false, paid: false },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Image / Text Generator</h1>
      
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="image">Image Generation</TabsTrigger>
          <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="text">Text Generation</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Generate Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageGeneration} className="space-y-4">
                <Input name="imagePrompt" placeholder="Enter your prompt" required />
                <Select name="imageModel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {imageModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                        <Badge variant={model.censored ? "default" : "destructive"} className="ml-2">
                          {model.censored ? "Censored" : "Uncensored (NSFW)"}
                        </Badge>
                        {model.paid && (
                          <Badge variant="secondary" className="ml-2">
                            PAID
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="width-slider">Width: {imageWidth}</label>
                    <input
                      id="width-slider"
                      type="range"
                      min="64"
                      max="2048"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="height-slider">Height: {imageHeight}</label>
                    <input
                      id="height-slider"
                      type="range"
                      min="64"
                      max="2048"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Seed"
                      value={imageSeed}
                      onChange={(e) => setImageSeed(Number(e.target.value))}
                      disabled={useRandomSeed}
                    />
                    <Switch
                      checked={useRandomSeed}
                      onCheckedChange={setUseRandomSeed}
                    />
                    <span>Random</span>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Image
                </Button>
              </form>
              {imageStatus === 'pending' && (
                <div className="mt-4 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {imageResult && imageStatus === 'success' && (
                <div className="mt-4">
                  <Image
                    src={imageResult}
                    alt="Generated Image"
                    width={imageWidth}
                    height={imageHeight}
                    className="max-w-full h-auto"
                  />
                  <Button onClick={regenerateWithRandomSeed} className="mt-2">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Again with Random Seed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Generate Text</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextGeneration} className="space-y-4">
                <Textarea name="textPrompt" placeholder="Enter your prompt" required />
                <Select name="textModel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {textModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                        <Badge variant={model.censored ? "default" : "destructive"} className="ml-2">
                          {model.censored ? "Censored" : "Uncensored (NSFW)"}
                        </Badge>
                        {model.paid && (
                          <Badge variant="secondary" className="ml-2">
                            Paid
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Text
                </Button>
              </form>
              {textResult && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <pre className="whitespace-pre-wrap">{textResult}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}