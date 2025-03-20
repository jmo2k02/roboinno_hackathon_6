import {create} from 'zustand'

interface EditorState {
    createdSvg: boolean,
    invertCreatedSvg: () => void
}

const useEditorStore = create<EditorState>()((set) => ({
    createdSvg: false,
    invertCreatedSvg: () => set((state) => ({
        createdSvg: !state.createdSvg
    }))
  }))

export default useEditorStore;