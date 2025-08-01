export const downloadDocument = (content: string, filename: string) => {
  
  let element = document.createElement('a')
  element.setAttribute('href', content)
  element.setAttribute('target', '_blank')
  element.setAttribute('download', filename)

  document.body.appendChild(element)
  element.click()

  document.body.removeChild(element)
}


export const downloadDocumentPreSigned = async (url: string, filename :string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl); // cleanup
};
