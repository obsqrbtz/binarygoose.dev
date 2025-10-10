export function createStyledTitle(title: string){
        return title
        .replace(/[^\w\s-]/g, "") // remove weird symbols like slashes
        .replace(/\s+/g, "-")      // replace spaces with dashes
        .toLowerCase();
}