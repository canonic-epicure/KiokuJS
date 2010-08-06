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
        'Task.KiokuJS.NodeJSPrereq',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + JSON.stringify(INC)
        },
        'Task.KiokuJS.Test'
        
    ] : [
        'Task.KiokuJS.WebPrereq',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + Ext.encode(Harness.absolutizeINC(INC))
        },
        'Task.KiokuJS.Test'
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_serializer_json.t.js',
    '030_resolver.t.js',
    '050_collapser.t.js',
    '051_collapser_shallow.t.js',
    '052_collapser_intrinsic.t.js',
    '060_encoder.t.js',
    '061_encoder_intrinsic.t.js',
    '062_encoder_reserved_keys.t.js',
    '070_decoder.t.js',
    '071_decoder_intrinsic.t.js',
    '072_decoder_reserved_keys.t.js',
    '080_expander.t.js',
    '081_expander_intrinsic.t.js',
    '082_expander_reserved_keys.t.js',
    '090_gatherer.t.js',
    '100_backend_hash_sanity.t.js',
    '110_fixture_object_graph.t.js',
    '120_fixture_overwrite.t.js',
    '130_fixture_update.t.js',
    '140_fixture_remove.t.js'
)
