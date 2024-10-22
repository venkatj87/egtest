export const __toString = (data: string | []): string => {
    if(Array.isArray(data)){
        return data.join(',');
    } else{ 
        return data;
    }
}