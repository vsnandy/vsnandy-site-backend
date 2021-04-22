import pandas as pd
import sys
from nba_api.stats.endpoints import commonallplayers, leagueleaders
from nba_api.stats.static import teams
import json

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

###################
## Helper Methods #
###################

# Get Team ID from full name
def get_team_id(team_name):
    try:
        for team in teams.get_teams():
            if team['full_name'].lower() == team_name.lower():
                return team['id']
        return -1
    except Exception as e:
        return "Error"

# Get Player ID from full name
def get_player_id(player_name):
    try:
        all_players = commonallplayers.CommonAllPlayers(headers=custom_headers, timeout=100)
        for player in all_players.get_dict()['resultSets'][0]['rowSet']:
            if player[2].lower() == player_name.lower():
                return player[0]
        return -1
    except Exception as e:
        return "Error"

###############
## Functions ##
###############

# Get player details
def get_player_details(args):
    player_id = get_player_id(args[0])
    print(player_id)
    sys.stdout.flush()
    return

# Get league leaders for specified stat category
def get_league_leaders(args):
    try:
        leaders = leagueleaders.LeagueLeaders(headers=custom_headers, stat_category_abbreviation=args[0], timeout=100)
        print(leaders.get_json())
        sys.stdout.flush()
        return
    except Exception as e:
        return "Error"

###############
## Variables ##
###############

# Dispatch Dictionary
# TODO: add new API call methods here
dispatch = {
    'player_details': get_player_details,
    'league_leaders': get_league_leaders,
}

############
## Script ##
############

# Method to call the correct nba api call
def process_command(command, args):
    dispatch[command](args)

# Make the call
process_command(sys.argv[1], sys.argv[2:])