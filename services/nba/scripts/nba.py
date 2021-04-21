import pandas as pd
import sys
from nba_api.stats.endpoints import commonallplayers
import json

###############
## Functions ##
###############

# Get player details
def get_player_details(args):
    player_name = args[0]
    all_players = commonallplayers.CommonAllPlayers(headers=custom_headers).get_dict()['resultSets'][0]
    for player in all_players['rowSet']:
        if player[2] == player_name:
            print(player[0])
            sys.stdout.flush()
            return

    print(-1)
    sys.stdout.flush()
    return

###############
## Variables ##
###############

custom_headers = {
    'Host': 'stats.nba.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://stats.nba.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'x-nba-stats-origin': 'stats',
    'x-nba-stats-token': 'true'
}

# Dispatch Dictionary
# TODO: add new API call methods here
dispatch = {
    'player_details': get_player_details,
}

############
## Script ##
############

# Method to call the correct nba api call
def process_command(command, args):
    dispatch[command](args)

# Make the call
process_command(sys.argv[1], sys.argv[2:])