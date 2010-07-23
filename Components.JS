COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        
        "KiokuJS.Exception",
        "KiokuJS.Exception.Network",
        "KiokuJS.Exception.Format",
        
        "KiokuJS.Role.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Role.NoDeps",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Role.Resolvable",
        
        "KiokuJS.Node",
        
        "KiokuJS.Collapser.Encoder",
        "KiokuJS.Collapser.Decoder",
        
        "KiokuJS.Linker.Gatherer",
        "KiokuJS.Linker.Expander",
        
        "KiokuJS.Backend.Role.SkipFixture",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        "KiokuJS.Collapser",
        "KiokuJS.Linker",
        
        "KiokuJS.Scope",
        "KiokuJS"
    ],
    
    
    "Test" : [
        "+Core",
        
        "KiokuJS.Test.Person",
        
        "KiokuJS.Test.Fixture",
        "KiokuJS.Test.Fixture.ObjectGraph",
        "KiokuJS.Test"
    ],
    
    
    "WebPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor"
    ],
    
    
    "NodeJSPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:Task.JooseX.Namespace.Depended.NodeJS",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor"
    ]
} 


