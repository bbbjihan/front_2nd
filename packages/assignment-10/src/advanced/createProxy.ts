const createProxy = () => {
  const cache: Record<string, string> = {};

  const getCachedFile = (url: string): string | undefined => {
    try{
      
    if(!cache[url]){
      console.log(`[MISS] ${url}`);
      return;
    }
    
    console.log(`[HIT] ${url}`)
    return cache[url];
  
    }catch(err){
      console.log(`[ERROR] ${url}, ${err})`)
      return
    }
  };

  const setCacheFile = (url: string, content: string): void => {
    cache[url] = content;
  };

  return {
    getCachedFile,
    setCacheFile,
  };
};

export default createProxy;