interface IDateFilter {
    $gte?: Date;
    $lte?: Date;
}

export interface IMatchStage {
    createdAt?: IDateFilter;
}
