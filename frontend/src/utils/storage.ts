export const saveItem = (key: string, value: any) => {
    localStorage.setItem('user', JSON.stringify(value));
}

export const removeItem = (key: string) => {
    return localStorage.removeItem(key);
}

// Get the stored user object
export const getUser = () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    return JSON.parse(userString);
}