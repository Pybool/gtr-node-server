export const getNewsCategory = (category: string): string[] => {
	return Object.keys(HeaderEnum).filter(key=>HeaderEnum[key]===category);
};
export enum HeaderEnum{
    News="news",
    World="world",
    National="national",
    Politics="politics",
    Sports="sports",
    Tech="tech",
    Newspaper="ghana-newspaper",
    Coronavirus="coronavirus-updates",
    Entertainment='entertainment',
    Music="music",
    Lifestyle="lifestyle",
    Food="food",
    Health="health",
    Travel="travel",
    Education="education",
    WallOfFame="wall-of-fame",
    ThingsToDoThisWeekend="things-to-do-this-weekend",
    GtrGamesAndPartyBash="gtr-games-and-party-bash",
    Crime="crime",
    Cryptocurrency="cryptocurrency",
}
