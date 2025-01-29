export const uploadAvatar = async(avatar:File)=>{
    const FileFormData = new FormData()
    FileFormData.append("file",avatar)
    const response = await fetch("/api/image-upload",{method:"POST",body:FileFormData})
    const uploadResult = await response.json() 
    console.log(  uploadResult) 
    return uploadResult 
  }