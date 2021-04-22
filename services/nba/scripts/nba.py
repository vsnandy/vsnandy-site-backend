import pandas as pd
import sys
from nba_api.stats.endpoints import commonallplayers, leagueleaders
from nba_api.stats.static import teams
import json
import requests
from lxml.html import fromstring
import random
import time

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

proxies = ['195.154.84.106:5566', '104.236.195.241:8080', '176.28.64.225:3128', 
    '138.36.151.15:8090', '80.244.230.86:8080', '46.175.70.69:44239', '139.59.254.67:8080', 
    '103.154.241.252:8080', '54.255.218.28:3128', '203.26.189.28:3128', '68.183.107.45:8080', 
    '128.199.188.60:8080', '128.199.60.240:8080', '183.88.226.50:8080', '145.40.68.155:80', 
    '178.33.148.10:3128', '103.213.228.62:3128', '139.59.252.150:8080', '168.119.103.160:10303', 
    '65.0.113.10:3128', '178.62.207.37:8080', '178.128.59.125:8118', '1.2.187.126:44617', 
    '103.28.121.58:80', '85.185.159.75:8080', '157.90.4.18:8001', '132.248.196.2:8080'
]

###################
## Helper Methods #
###################

'''
def get_proxies():
    url = 'https://free-proxy-list.net/'
    response = requests.get(url)
    parser = fromstring(response.text)
    proxies = set()
    for i in parser.xpath('//tbody/tr'):
        if i.xpath('.//td[7][contains(text(),"yes")]'):
            proxy = ":".join([i.xpath('.//td[1]/text()')[0], i.xpath('.//td[2]/text()')[0]])
            proxies.add(proxy)

    return list(proxies)
'''

# Get Team ID from full name
def get_team_id(team_name):
    try:
        for team in teams.get_teams():
            if team['full_name'].lower() == team_name.lower():
                return team['id']
        return -1
    except Exception as e:
        return -2

# Get Player ID from full name
def get_player_id(player_name):
    try:
        time.sleep(1)
        all_players = commonallplayers.CommonAllPlayers(headers=custom_headers, 
            proxy=proxies[0], timeout=10)
        for player in all_players.get_dict()['resultSets'][0]['rowSet']:
            if player[2].lower() == player_name.lower():
                return player[0]
        return -1
    except Exception as e:
        return -2

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
        time.sleep(1)
        leaders = leagueleaders.LeagueLeaders(headers=custom_headers, 
            stat_category_abbreviation=args[0], proxy=proxies[0], timeout=10)
        print(leaders.get_json())
        sys.stdout.flush()
        return
    except Exception as e:
        print(-2)
        sys.stdout.flush()
        return

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