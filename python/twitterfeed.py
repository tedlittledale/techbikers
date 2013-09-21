import argparse
import datetime
import json
import sys
import time
import tweepy


def parse_args():
    p = argparse.ArgumentParser(
        description='Search for a hashtag and write it to stdout'
    )
    p.add_argument('--consumer-key', required=True)
    p.add_argument('--consumer-secret', required=True)
    p.add_argument('--access-token', required=True)
    p.add_argument('--access-token-secret', required=True)
    p.add_argument(
        '--hashtag',
        required=True,
        help='Hashtag to search for - without the hash mark'
    )
    p.add_argument(
        '--item-count',
        required=True,
        help='Number of items',
        type=int
    )
    return p.parse_args()


def main():
    ns = parse_args()
    auth = tweepy.OAuthHandler(ns.consumer_key, ns.consumer_secret)
    auth.set_access_token(ns.access_token, ns.access_token_secret)
    api = tweepy.API(auth)

    # This will raise an exception if it doesn't work, we just let that
    # bubble up.
    cursor = tweepy.Cursor(api.search, q=u'#%s' % ns.hashtag)
    result = [r for r in cursor.items(ns.item_count)]
    sys.stdout.write(json.dumps(result, default=customjson))


def customjson(ob):
    if isinstance(ob, datetime.datetime):
        return millis(ob)
    elif isinstance(ob, tweepy.models.Model):
        return safedict(ob)


def safedict(ob):
    return {
        k: v
        for k, v in ob.__dict__.items()
        if not k.startswith('_')
    }


def millis(dt):
    # We don't care about sub-millisecond accuracy when converting to
    # milliseconds.
    s = time.mktime(dt.timetuple()) + dt.microsecond / 1000000
    return int(s * 1000)


if __name__ == '__main__':
    main()
