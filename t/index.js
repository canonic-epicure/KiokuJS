var Harness

if (typeof process != 'undefined' && process.pid) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = [ '../lib', '/jsan' ]


Harness.configure({
    title : 'KiokuJS Test Suite',
    
//    transparentEx : true,
//    keepResults : true,
//    verbosity : 1,
    
    preload : Joose.is_NodeJS ? [
        'Task.KiokuJS.NodeJSTest',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + JSON.stringify(INC)
        }
        
    ] : [
        'Task.KiokuJS.WebTest',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + Ext.encode(Harness.absolutizeINC(INC))
        }
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_serializer_json.t.js',
    '030_resolver.t.js',
    '050_collapser.t.js',
    '051_collapser_shallow.t.js',
    '060_encoder.t.js',
    '061_encoder_intrinsic.t.js',
    '062_encoder_reserved_keys.t.js',
    '070_decoder.t.js',
    '080_expander_self_reference.t.js',
    '090_gatherer.t.js',
    '100_backend_hash_sanity.t.js',
    '110_backend_hash_fixtures.t.js'
)
