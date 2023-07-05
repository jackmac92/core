#!/usr/bin/env python

import slack_sdk
from collections import defaultdict
import operator

# Instantiate client with token
client = slack_sdk.WebClient(token="your-slack-token")

# Name of the channel you are interested in
channel_name = 'your-channel-name'

# Get list of all channels
channels = client.conversations_list().get('channels', [])

# Get the ID of the channel of interest
channel_id = None
for channel in channels:
    if channel['name'] == channel_name:
        channel_id = channel['id']
        break

# If the channel wasn't found, exit
if channel_id is None:
    print(f"Channel {channel_name} not found.")
    exit()

# Keep track of emoji reactions
reactions_counter = Counter()

# Keep track of message links
reactions_messages = defaultdict(list)

# Pagination handling
has_more = True
cursor = None

while has_more:
    response = client.conversations_history(
        channel=channel_id,
        inclusive=True,
        cursor=cursor
    )

    messages = response.data.get('messages', [])
    for message in messages:
        reactions = message.get('reactions', [])
        for reaction in reactions:
            users = reaction.get('users', [])
            if reaction['count'] > 0 and users[0] == 'your-user-id':
                # replace 'your-user-id' with your actual user ID
                reactions_counter[reaction['name']] += 1
                msg_link_resp = client.chat_getPermalink(channel=channel_id, message_ts=message['ts'])
                msg_link = msg_link_resp.data.get('permalink', '')
                reactions_messages[reaction['name']].append(msg_link)

    cursor = response.data.get('response_metadata', {}).get('next_cursor')
    has_more = bool(cursor)

# Get top 50 reactions
top_reactions = dict(reactions_counter.most_common(50))

# Print top 50 reactions along with links
for reaction, count in top_reactions.items():
    print(f"{reaction}: {count}")
    print("Messages:")
    for message_link in reactions_messages[reaction]:
        print(message_link)
