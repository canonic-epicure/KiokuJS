var Harness

if (typeof process != 'undefined' && process.pid) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = [ '../lib', '/jsan' ]


Harness.configure({
    title : 'KiokuJS Test Suite',
    
    transparentEx : true,
    
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
    '040_backend_hash.t.js',
    '050_collapser.t.js',
    '051_collapser_intrinsic.t.js',
    '052_collapser_self_reference.t.js',
    '060_expander_self_reference.t.js',
    '090_gatherer.t.js',
    '100_simpsons.t.js'
)
