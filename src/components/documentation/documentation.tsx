'use client'

import { Project } from '@/payload-types'
import { FC, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { updateDocumentationAction } from '@/actions/project-action'
// import SimpleMDE from 'react-simplemde-editor'
import ReactMarkdown from 'react-markdown'
import 'easymde/dist/easymde.min.css'
import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

export const Documentation: FC<{
  project: Project
}> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false)
  const editorRef = useRef<string | null>(null);
  const [editor, setEditor] = useState(editorRef.current || null)
  

  const exportToMarkdown = () => {
    const blob = new Blob([project.documentation || ''], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name}-documentation.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card 
        className="col-span-2"
        onDragOver={(e) => e.preventDefault()} 
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result as string;
              editorRef.current = content;
              setIsEditing(true);
              setEditor(content);
            };
            reader.readAsText(file);
          }
        }}
      >
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
        <CardDescription>Project documentation</CardDescription>
        </CardHeader>
          <CardContent className="flex-grow">
          {isEditing ? (
            <SimpleMDE
              value={editorRef.current || ''}
              onChange={(value) => editorRef.current = value}
              options={{
                spellChecker: false,
                placeholder: 'Write your project documentation here...',
              }}
            />
          ) : (
            <div className="prose">
              <ReactMarkdown>{project.documentation || ''}</ReactMarkdown>
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="default" 
              onClick={() => {
                if (isEditing) {
                  project.documentation = editorRef.current || '';
                  updateDocumentationAction(project.id, project.documentation)
                } else {
                  editorRef.current = project.documentation || '';
                }
                setIsEditing(!isEditing)
              }}
            >
            {isEditing ? 'Save' : 'Edit'}
            </Button>
            {isEditing ? <Button variant="destructive" onClick={() => setIsEditing(false)}>Cancel</Button> : <></>}
            <input
              type="file"
              accept=".md"
              id="import-documentation"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string;
                    editorRef.current = content;
                    setIsEditing(true);
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <Button variant="default" onClick={() => document.getElementById('import-documentation')?.click()}            >
              Import Documentation
            </Button>
            {!isEditing && (
              <>
                <Button variant="default" onClick={exportToMarkdown}>
                Export Documentation
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
