import container from '../dependencies/container';

var Service = container.getType('Service');
var crypto = container.getType('crypto');
var $Rest = container.getType('$Rest');
var $Cookie = container.getType('$Cookie');
var notify = container.getType('Notify');
var Event = container.getType('Event');

class Profile extends Service {
    static get() {
        return $Cookie.get('profile');
    }

    static login(params, callback) {
        this.$provider.post(params, 'Login', function (err, data) {
            if (!err) {
                //success
                var token = crypto.getBase64Token(params.username, params.password);
                var $Cookie = container.getType('$Cookie');
                $Cookie.set('token', token);
                $Cookie.set('profile', data);
                var Location = container.getType('Location');
                var Event = container.getType('Event');
                Event.emit('app.login', data);
                notify.show('Login Successful');
                Location.href = '/';
            } else {
                //failure
                notify.show('Invalid Login');
            }
        });
    }

    static logout(params, callback) {
        $Cookie.delete('token');
        $Cookie.delete('profile');
        Event.emit('app.logout', null);
        if (callback) {
            callback(null, {message: 'You have been logged out from your account...'});
        }
    }

    static authenticated() {
        var $Cookie = container.getType('$Cookie');
        var token = $Cookie.get('token');
        var profile = $Cookie.get('profile');
        return (token !== undefined && token) ? profile : null;
    }
}

container.mapType('Profile', Profile, new $Rest());

 