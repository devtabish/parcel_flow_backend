export interface IRecentOrderMatch {
    $or?: Array<
        | {
              _id: {
                  $regex: string;
                  $options: string;
              };
          }
        | {
              fullName: {
                  $regex: string;
                  $options: string;
              };
          }
        | {
              email: {
                  $regex: string;
                  $options: string;
              };
          }
    >;
}
