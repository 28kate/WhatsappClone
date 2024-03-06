export const listMessagesByChatRoom = /* GraphQL */ `
  query ListMessagesByChatRoom(
    $chatroomID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessagesByChatRoom(
      chatroomID: $chatroomID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        text
        chatroomID
        userID
        images
        Attachments {
          nextToken
          startedAt
          __typename
          items {
            id
            storageKey
            type
            width
            height
            duration
            messageID
            chatroomID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            __typename
          }
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;