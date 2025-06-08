export interface ResponseModel<T>{
    count: number
    data: T | T[] 
}