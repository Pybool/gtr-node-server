export interface PostInterface {
    ID: string;
    post_author: string;
    post_date: string;
    post_date_gmt: string;
    post_content: string;
    post_title: string;
    post_excerpt: string;
    post_status: string;
    comment_status: string;
    ping_status: string;
    post_password: string;
    post_name: string;
    to_ping: string;
    pinged: string;
    post_modified: string;
    post_modified_gmt: string;
    post_content_filtered: string;
    post_parent: string;
    guid: string;
    menu_order: string;
    post_type: string;
    post_mime_type: string;
    comment_count: string;
    image: string;
    categoryname: string;
    categoryarray?:{name:string;slug:string}[];
}
export interface LandingInterface{
    all:PostInterface[];
    ghana_newspaper:PostInterface[][];
    lifestyle:PostInterface[][];
    news:PostInterface[][];
    totalNews?:number;
}
export interface MoreTodayInterface{
    status:boolean;
    message:string;
    data:{news:PostInterface[][];}
    
}
export interface LandingResponseInterface{
    status:boolean;
    message:string;
    data:LandingInterface
}
export interface SingleViewInterface{
    status:boolean;
    message:string;
    data:{img:string[];post:PostInterface[],othernews:PostInterface[]}
}
export interface CategoryViewInterface{
    status:boolean;
    message:string;
    data:{news:PostInterface[],total?:number,tags?:{name:string;url:string;}[]}
}
export interface customPodcastInterface{
    catachupId:catchupPodcastInterface;
    status:boolean;
}

export interface catchupPodcastDataInterface {
    id: string;
    show_id: string;
    start_date: string;
    end_date: string;
    url: string;
    description: string;
    catchup_id: string;
}

export interface catchupPodcastDetailsInterface {
    id: string;
    name: string;
    image: string;
    catchup_id: string;
}

export interface catchupPodcastInterface {
    data: catchupPodcastDataInterface;
    details: catchupPodcastDetailsInterface;
    status:boolean;
}

export interface LatestViewInterface{
    status:boolean;
    message:string;
    data:{news:PostInterface[];total:number}
}
export interface SearchResultInterface{
    status:boolean;
    message:string;
    data:PostInterface[]
}